# Contracts

このディレクトリは、API契約やインターフェース定義を格納するために予約されています。

## 注意

このプロジェクトはFigmaプラグインであり、外部APIを公開しません。したがって、このディレクトリには具体的な契約ファイルは含まれません。

## 内部契約

内部的な契約（型定義、インターフェース）は、以下のファイルで定義されています:

1. **TbodyElement インターフェース**: `src/converter/elements/table/tbody/tbody-element/tbody-element.ts`
2. **TfootElement インターフェース**: `src/converter/elements/table/tfoot/tfoot-element/tfoot-element.ts`
3. **Attributes インターフェース**:
   - `src/converter/elements/table/tbody/tbody-attributes/tbody-attributes.ts`
   - `src/converter/elements/table/tfoot/tfoot-attributes/tfoot-attributes.ts`

## 参照

詳細なデータモデルについては、[data-model.md](../data-model.md)を参照してください。
