// Handled by next.config.mjs redirect to /booked/:id
// This file must remain to satisfy git history but is never served.
// The redirect in next.config.mjs intercepts all /confirmation/* requests
// before they reach this page handler.
export default function ConfirmationShim() {
  return null;
}
