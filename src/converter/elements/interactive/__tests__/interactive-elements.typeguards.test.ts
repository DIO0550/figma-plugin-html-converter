import { test, expect } from "vitest";
import { SummaryElement } from "../summary";
import { DetailsElement } from "../details";
import { DialogElement } from "../dialog";

test("型ガード連携 - 異なる要素を正しく区別できる", () => {
  const summary = SummaryElement.create();
  const details = DetailsElement.create();
  const dialog = DialogElement.create();

  expect(SummaryElement.isSummaryElement(summary)).toBe(true);
  expect(SummaryElement.isSummaryElement(details)).toBe(false);
  expect(SummaryElement.isSummaryElement(dialog)).toBe(false);

  expect(DetailsElement.isDetailsElement(summary)).toBe(false);
  expect(DetailsElement.isDetailsElement(details)).toBe(true);
  expect(DetailsElement.isDetailsElement(dialog)).toBe(false);

  expect(DialogElement.isDialogElement(summary)).toBe(false);
  expect(DialogElement.isDialogElement(details)).toBe(false);
  expect(DialogElement.isDialogElement(dialog)).toBe(true);
});
