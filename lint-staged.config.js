module.exports = {
  "*.{js,jsx}": "eslint --cache --fix --max-warnings=0",
  "*.{ts,tsx}": [() => "tsc --skipLibCheck", "eslint --fix --max-warnings=0"],
}
