export const categoriesQuery = `
use dbMacro
SELECT catg_id AS cId,
name_hebrew AS name,
name_english AS NameEnglish,
CASE LEN(catg_id)
WHEN 1 THEN (SELECT COUNT(*)
FROM prPasp
WHERE LEFT(pasp_id,1) = prCatg.catg_id)
WHEN 2 THEN (SELECT COUNT(*)
FROM prPasp
WHERE LEFT(pasp_id,2) = prCatg.catg_id)
WHEN 3 THEN (SELECT COUNT(*)
FROM prPasp
WHERE LEFT(pasp_id,3) = prCatg.catg_id)
END AS NumberInTree
FROM prCatg
WHERE CASE LEN(catg_id)
WHEN 1 THEN (SELECT COUNT(*)
FROM prPasp
WHERE LEFT(pasp_id,1) = prCatg.catg_id)
WHEN 2 THEN (SELECT COUNT(*)
FROM prPasp
WHERE LEFT(pasp_id,2) = prCatg.catg_id)
WHEN 3 THEN (SELECT COUNT(*)
FROM prPasp
WHERE LEFT(pasp_id,3) = prCatg.catg_id)
END <> 0
ORDER BY catg_id
    `;

    