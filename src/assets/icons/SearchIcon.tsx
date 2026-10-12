type Props = {
    active?: boolean
}

function SearchIcon(props: Props) {
    const {active} = props
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.7883 22.0317C22.0706 21.7494 22.0706 21.2917 21.7883 21.0094L18.1224 17.3436C19.4884 15.7441 20.3133 13.6684 20.3133 11.4C20.3133 6.34297 16.2137 2.24341 11.1566 2.24341C6.09956 2.24341 2 6.34297 2 11.4C2 16.4571 6.09956 20.5567 11.1566 20.5567C13.4249 20.5567 15.5006 19.7319 17.1 18.3659L20.7659 22.0317C21.0483 22.314 21.506 22.314 21.7883 22.0317Z" fill={active ? '#FFF' : '#3A5F6E'}/>
    </svg>
    
  )
}

export default SearchIcon