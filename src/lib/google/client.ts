export type SheetsUpdatePayload = {
  range: string;
  values: string[][];
};

export async function readSheetRange(
  accessToken: string,
  spreadsheetId: string,
  range: string,
) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
  );

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to read sheet range");
  }

  const data = await response.json();
  return (data.values as string[][]) ?? [];
}

export async function ensureSheetHeaders(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  expectedHeaders: string[],
): Promise<boolean> {
  const range = `'${sheetName}'!1:1`;
  let existingValues: string[][];
  let sheetExists = true;

  try {
    existingValues = await readSheetRange(accessToken, spreadsheetId, range);
  } catch {
    existingValues = [];
    sheetExists = false;
  }

  if (existingValues.length > 0) {
    const firstRow = existingValues[0].map((v) => v.trim().toLowerCase());
    const normalizedExpected = expectedHeaders.map((h) =>
      h.trim().toLowerCase(),
    );
    const matchCount = normalizedExpected.filter((h) =>
      firstRow.includes(h),
    ).length;
    if (matchCount >= 2) return false;
  }

  if (!sheetExists) {
    const addRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        }),
      },
    );

    if (!addRes.ok) {
      const msg = await addRes.text();
      throw new Error(msg || "Failed to create sheet tab");
    }
  } else if (existingValues.length > 0) {
    const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`;
    const metaRes = await fetch(metaUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!metaRes.ok) throw new Error("Failed to fetch spreadsheet metadata");

    const meta = await metaRes.json();
    const sheet = meta.sheets.find(
      (s: { properties: { title: string; sheetId: number } }) =>
        s.properties.title === sheetName,
    );

    if (sheet) {
      const dimRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                insertDimension: {
                  range: {
                    sheetId: sheet.properties.sheetId,
                    dimension: "ROWS",
                    startIndex: 0,
                    endIndex: 1,
                  },
                  inheritFromBefore: false,
                },
              },
            ],
          }),
        },
      );

      if (!dimRes.ok) {
        const msg = await dimRes.text();
        throw new Error(msg || "Failed to insert header row");
      }
    }
  }

  const lastCol = String.fromCharCode(
    64 + Math.min(expectedHeaders.length, 26),
  );
  await updateSheetValues(accessToken, spreadsheetId, {
    range: `'${sheetName}'!A1:${lastCol}1`,
    values: [expectedHeaders],
  });

  return true;
}

export async function updateSheetValues(
  accessToken: string,
  spreadsheetId: string,
  payload: SheetsUpdatePayload,
) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      payload.range,
    )}`,
  );
  url.searchParams.set("valueInputOption", "USER_ENTERED");

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      majorDimension: "ROWS",
      values: payload.values,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update sheet");
  }

  return response.json();
}

export async function appendSheetValues(
  accessToken: string,
  spreadsheetId: string,
  payload: SheetsUpdatePayload,
) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      payload.range,
    )}:append`,
  );
  url.searchParams.set("valueInputOption", "USER_ENTERED");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      majorDimension: "ROWS",
      values: payload.values,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to append sheet row");
  }

  return response.json();
}
