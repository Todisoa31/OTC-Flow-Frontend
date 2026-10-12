import './CenterSpinner.css'
type Props = {
  center?: boolean
}
function CenterSpinner(props: Props) {
  const { center } = props;
  return (
    <div className={`loader-spinner m-auto ${center ? "absolute top-0 bottom-0 right-0 left-0" : ''}`}></div>
  )
}

export default CenterSpinner