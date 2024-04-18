// @ts-check

// @ts-expect-error shut up
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin-ts"

export default tseslint.config(
  {
    files: ["** /*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked
    ],
    plugins: {
      // @ts-expect-error shut up
      "@stylistic/ts": stylistic
    },
    rules: {
      "@stylistic/ts/indent": ["error", 2]
    }
  }
)