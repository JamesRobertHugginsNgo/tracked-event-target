import EventListenerTracker from './event-listener-tracker.js';
import TrackedEventTarget from './tracked-event-target.js';

import test, { describe, mock } from 'node:test';
import assert from 'node:assert';

describe('tracked-event-target.test.js', () => {
	test('pass smoke test', () => {
		const trackedEventTarget = new TrackedEventTarget();

		assert.ok(trackedEventTarget._tracker instanceof EventListenerTracker);
		assert.equal(trackedEventTarget.canDispatch('change'), false);
	});

	test('add event listener', () => {
		const trackedEventTarget = new TrackedEventTarget();
		const listener = mock.fn();

		trackedEventTarget.addEventListener('change', listener);
		trackedEventTarget.dispatchEvent(new CustomEvent('change', { detail: {} }));

		assert.strictEqual(trackedEventTarget.canDispatch('change'), true);
		assert.strictEqual(listener.mock.calls.length, 1);
	});

	test('add "once" event listener', () => {
		const trackedEventTarget = new TrackedEventTarget();
		const listener = mock.fn();

		trackedEventTarget.addEventListener('change', listener, { once: true });
		trackedEventTarget.dispatchEvent(new CustomEvent('change', { detail: {} }));

		assert.strictEqual(trackedEventTarget.canDispatch('change'), false);
		assert.strictEqual(listener.mock.calls.length, 1);
	});

	test('remove event listener', () => {
		const trackedEventTarget = new TrackedEventTarget();
		const listener = mock.fn();

		trackedEventTarget.addEventListener('change', listener);
		trackedEventTarget.removeEventListener('change', listener);
		trackedEventTarget.dispatchEvent(new CustomEvent('change', { detail: {} }));

		assert.equal(trackedEventTarget.canDispatch('change'), false);
		assert.equal(listener.mock.calls.length, 0);
	});

	test('remove "captured" event listener', () => {
		const trackedEventTarget = new TrackedEventTarget();
		const listener = () => void 0;

		trackedEventTarget.addEventListener('change', listener);
		trackedEventTarget.addEventListener('change', listener, { capture: true });
		trackedEventTarget.removeEventListener('change', listener, { capture: true });

		assert.equal(trackedEventTarget.canDispatch('change'), true);
	});
});
