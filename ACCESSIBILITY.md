# Accessibility — ZYRO Electric

ZYRO Electric is a public-facing e-commerce platform built by [we3ds-solution](https://github.com/we3ds-solution). We are committed to making the platform usable by everyone, regardless of ability or assistive technology used.

Our goal is to meet **WCAG 2.1 Level AA** as an aspirational target across the Angular 18 frontend.

---

## Priorities

We currently focus accessibility efforts on:

- **Keyboard navigation** — all interactive elements (menus, modals, cart, forms) are fully keyboard operable
- **Screen reader support** — semantic HTML, ARIA roles/labels on dynamic components (toast notifications, slide-out cart drawer, filter panel)
- **Color contrast** — both dark and light themes meet a minimum 4.5:1 contrast ratio for body text
- **Focus management** — modals trap focus correctly; focus returns to the trigger element on close
- **Form accessibility** — all inputs have associated `<label>` elements and real-time error feedback is announced via `aria-live`

---

## Contributor Expectations

All contributors submitting user-facing changes must:

1. **Use semantic HTML** — prefer `<button>`, `<nav>`, `<main>`, `<section>` over `<div>` wrappers
2. **Add ARIA attributes** where native semantics are insufficient (e.g., custom dropdowns, icon-only buttons)
3. **Test keyboard navigation** — tab through your change and verify logical focus order
4. **Avoid `tabindex > 0`** — use DOM ordering to control focus instead
5. **Include alt text** for all `<img>` elements; decorative images use `alt=""`
6. **Run Lighthouse** in Chrome DevTools before opening a PR — include the Accessibility score in your PR description

CI does not currently block on accessibility linting, but manual review is required for all UI-facing PRs.

---

## Reporting Accessibility Issues

If you encounter a barrier that prevents you from using ZYRO Electric, please let us know.

**Email:** `we3ds.solution@gmail.com`  
**Subject:** `[A11Y] <brief description of the barrier>`  
**GitHub Issue:** Use the **🐛 Bug Report** template and add the `accessibility` label

Please include:
- The task you were trying to complete
- The URL or page where the barrier occurred
- Your browser, operating system, and assistive technology (e.g., NVDA, VoiceOver, Switch Access)
- Screenshots or screen recordings (optional — not required)
- You do **not** need to disclose your disability

### Severity Labels

| Severity | Definition |
|---|---|
| **Critical** | Completely prevents a user from completing a core task (e.g., cannot add to cart, cannot submit checkout) |
| **High** | Major barrier — task is very difficult or requires a workaround |
| **Medium** | Degraded experience but task is still completable |
| **Low** | Cosmetic or minor inconsistency |

---

## How We Respond

After you submit an accessibility report:

1. **Acknowledgement** within 48 hours
2. **Severity assessment** and issue creation within 5 business days
3. **Fix or workaround** communicated within the issue thread
4. **You'll be invited** to verify the fix before the issue is closed (optional)

---

## Ownership & Maintenance

Accessibility review is the responsibility of all **we3ds-solution** maintainers, with UI-facing PRs requiring at least one maintainer review.

Accessibility audits are performed manually during major releases. No automated CI gate is in place yet — this is a known gap tracked in issue backlog.

---

## Supported Environments

We test and support the following:

| Platform | Browser | Assistive Technology |
|---|---|---|
| Windows | Chrome (latest) | NVDA |
| Windows | Firefox (latest) | NVDA |
| macOS | Safari (latest) | VoiceOver |
| macOS | Chrome (latest) | VoiceOver |
| iOS | Safari | VoiceOver |
| Android | Chrome | TalkBack |

Keyboard navigation is tested on all major desktop browsers.

---

## Known Limitations

- **Product image gallery**: Arrow-key navigation between gallery images is not yet implemented
- **Toast notifications**: Duration cannot be extended by users — tracked in [#todo]
- **Filter panel on mobile**: Focus does not automatically move into the panel when opened on narrow viewports
- **Cart quantities**: Increment/decrement buttons use icon-only labels — `aria-label` is present but screen reader verbosity varies

---

## Feedback & Improvements

Have a suggestion for improving accessibility beyond a specific barrier? Open a GitHub Discussion or email `we3ds.solution@gmail.com`.

We welcome contributions to this statement and to the project's accessibility practices.
