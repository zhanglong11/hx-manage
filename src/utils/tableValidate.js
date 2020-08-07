const validNumberPrice = function ({ cellValue }) {
  return new Promise((resolve, reject) => {
    if (cellValue) {
      if (isNaN(cellValue)) {
        reject(new Error('请填写数字'))
      }
      if (cellValue < 0) {
        reject(new Error('必须为大于0的数'))
      } else {
        resolve()
      }
    } else {
      reject(new Error('不能为空'))
    }
  })
}
const validateCategoryCode = function ({ cellValue, row, $table }) {
  let flag =
    $table.data.filter(item => item._XID !== row._XID && item.categoryCode === cellValue).length > 0 ? false : true
  return new Promise((resolve, reject) => {
    if (cellValue) {
      if (!flag) {
        reject(new Error('已存在'))
      } else {
        resolve()
      }
    } else {
      reject(new Error('不能为空'))
    }
  })
}
export default {
  validNumberPrice,
  validateCategoryCode
}
