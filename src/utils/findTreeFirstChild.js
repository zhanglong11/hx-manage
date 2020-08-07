const findFirstChild = function (data) {
  if (data && data.children && data.children.length > 0) {
    return findFirstChild(data.children[0])
  } else {
    return data
  }
}
export default findFirstChild
