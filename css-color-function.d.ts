declare module 'css-color-function' {
  export function convert(cssString: string): string
  export function parse(cssString: string): any
  export default { convert, parse }
}
