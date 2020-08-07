export default function (rule, value, callback) {
  if (value === '') {
    callback()
  } else if (isNaN(value)) {
    callback(new Error('请输入数字!'))
  } else {
    callback()
  }
}
