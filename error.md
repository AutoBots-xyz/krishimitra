# UX Rule Violations Report

I have audited the project files in `kisanai-main` against the rules defined in your `ux-rules.md`. Below are all the instances where the current codebase violates these strict UX guidelines.

## 1. LOADING RULES: "Skeletons not spinners"
**Rule Violated**: *Never show a spinner when a skeleton can be shown instead.*
**Issues Found**:
- `src/app/(app)/scan/page.tsx` (Line 113): Uses a raw spinner (`<span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>`) instead of a UI skeleton.
- `src/app/(app)/dashboard/page.tsx` (Line 130): Uses `<Loader2 className="w-5 h-5 text-indigo animate-spin" />` for the weather loading state. A structural skeleton should be used instead.

## 2. MOBILE RULES: "Font sizes"
**Rule Violated**: *Never below 16px on mobile — iOS auto-zooms inputs below 16px. ❌ Font size under 16px on inputs.*
**Issues Found**:
- `src/components/ui/Input.tsx` (Line 13): The input uses the `text-sm` Tailwind class (14px). It must be changed to `text-base` (16px) to prevent iOS automatic zooming on focus.
- `src/features/ai-chat/components/ChatWindow.tsx` (Line 126): The chat input also uses `text-sm` and `outline-none`.
- `src/app/(app)/dashboard/page.tsx` (Line 98): Search/filter input uses `text-sm`.

## 3. RESPONSIVENESS RULES: "Images"
**Rule Violated**: *Use `next/image` — never raw `<img>` tags. Always define width and height.*
**Issues Found**:
- `src/app/(app)/dashboard/page.tsx` (Line 181): `<img src="/rice-blast.png" alt="Rice Blast" className="..." />` (Should use `next/image`).
- `src/app/(app)/dashboard/page.tsx` (Line 189): `<img src="/healthy-crop.png" alt="Healthy Crop" className="..." />`
- `src/app/(app)/scan/page.tsx` (Line 78): `<img src={preview} alt="Crop preview" className="..." />`

## 4. ANIMATION RULES: "Duration limits"
**Rule Violated**: *NEVER over 300ms — feels laggy. ❌ Animation over 300ms.*
**Issues Found**:
- `src/features/disease-detection/components/DiseaseReportCard.tsx` (Line 30): Uses `duration-1000` (`className="h-full bg-harvest transition-all duration-1000"`).
- `src/features/cropwatch/components/ConsentPopup.tsx` (Line 30): Uses `duration-1000 ease-linear`.
- `src/app/(app)/scan/page.tsx` (Line 131): Uses `duration-500` (`className="animate-in fade-in slide-in-from-bottom-4 duration-500"`).

## 5. ACCESSIBILITY RULES: "Focus states"
**Rule Violated**: *Never remove focus states (outline: none) without focus-visible styles.*
**Issues Found**:
- `src/features/ai-chat/components/ChatWindow.tsx` (Line 126): Uses `outline-none focus:ring-2`. While a ring is provided, `focus-visible` is the prescribed pattern in the UX rules to avoid removing outlines for keyboard users while hiding them for mouse users.
- `src/app/(app)/dashboard/page.tsx` (Line 98): Uses `outline-none focus:ring-2`.

---
*Recommendation: Review these specific files and replace the offending classes/components with their compliant counterparts as per `ux-rules.md`.*
