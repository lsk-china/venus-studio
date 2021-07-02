const loadedDirective = {
  inserted (el, binding) {
    console.log(el)
    console.log(binding)
  }
}
export default loadedDirective
