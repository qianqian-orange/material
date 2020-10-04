import variable from 'material/ui/common/var.less'

export default function (px) {
  return `${px / +variable.baseFontSize}rem`
}
