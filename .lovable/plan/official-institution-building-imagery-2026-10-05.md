# Official institution building imagery

## What will change
- Add the uploaded ECOWAS Commission headquarters image to the Commission institution page.
- Add the uploaded ECOWAS Parliament building image to the Parliament institution page.
- Present each photograph edge-to-edge across the page, with a stable responsive crop, descriptive alternative text, and an institutional caption.
- Keep the Court page and all existing institution content and functionality unchanged.

## Technical details
- Read both images directly from the existing public `institution-assets/Building` storage folder.
- Extend the shared institution profile record with optional building image metadata, then render one reusable full-width image band only when that metadata exists.
- Validate the Commission and Parliament pages at desktop and mobile widths, including image loading and layout overlap checks.
