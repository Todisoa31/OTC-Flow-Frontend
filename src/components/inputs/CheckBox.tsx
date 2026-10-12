'use client';
import { cn } from '@/utils/tailwind';
import { ChangeEvent } from 'react';

type Props = {
    id: string
    checked?: boolean;
    label?: string;
    onChange?: (value: boolean) => void,
    className?: string,
    stopPropagation?: boolean;
    label_color?: string;
    size?: 'small' 
};

function CheckBox(props: Props) {
    const {
        id,
        checked,
        onChange,
        label,
        stopPropagation = false,
        label_color,
        size
    } = props

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.checked);
    }

    const handleClick = (event: React.MouseEvent) => {
      if (stopPropagation) {
        event.stopPropagation();
      }
    };

    const sizeClass = size === 'small' ? `w-[20px] h-[20px]` : 'w-[25px] h-[25px]';

    const content = () =>{
        if(size === 'small'){
            return checked ?
                        <svg width={20} height={20} viewBox={size ? `0 0 ${size} ${size}` :"0 0 25 25"} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width={20} height={20} rx="3" fill="#65A5BF" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd" 
                                //d="M19.5603 9.22622C20.1969 8.55209 20.135 7.51766 19.4219 6.91575C18.7089 6.31385 17.6148 6.3724 16.9782 7.04654L10.0275 14.4067L8.02183 12.2829C7.3852 11.6088 6.29109 11.5502 5.57807 12.1521C4.86504 12.754 4.80311 13.7884 5.43974 14.4626L8.73644 17.9535C9.06481 18.3012 9.53444 18.5 10.0275 18.5C10.5205 18.5 10.9902 18.3012 11.3185 17.9535L19.5603 9.22622Z"
                                d="M17.0603 6.72622C17.6969 6.05209 17.635 5.01766 16.9219 4.41575C16.2089 3.81385 15.1148 3.8724 14.4782 4.54654L7.52748 11.9067L5.52183 9.78289C4.8852 9.10876 3.79109 9.05021 3.07807 9.65211C2.36504 10.254 2.30311 11.2884 2.93974 11.9626L6.23644 15.4535C6.56481 15.8012 7.03444 16 7.52748 16C8.02052 16 8.49015 15.8012 8.81852 15.4535L17.0603 6.72622Z"
                                fill="white"
                            />
                        </svg> :
                        <div className={cn(['w-[20px] h-[20px] rounded-[5px] border-2 border-primary-blue bg-white'])}></div>
        }
        else {
            return checked ?
                        <svg width={25} height={25} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width={25} height={25} rx="5" fill="#65A5BF" />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20.5603 10.2262C21.1969 9.55209 21.135 8.51766 20.4219 7.91575C19.7089 7.31385 18.6148 7.3724 17.9782 8.04654L10.0275 15.4067L8.02183 13.2829C7.3852 12.6088 6.29109 12.5502 5.57807 13.1521C4.86504 13.754 4.80311 14.7884 5.43974 15.4626L8.73644 18.9535C9.06481 19.3012 9.53444 19.5 10.0275 19.5C10.5205 19.5 10.9902 19.3012 11.3185 18.9535L20.5603 10.2262Z"
                                fill="white"
                            />
                        </svg> :
                        <div className={cn(['w-[25px] h-[25px] rounded-[5px] border-2 border-primary-blue bg-white'])}></div>
        }
    }
    
    return (
        <div data-svg-wrapper className={cn([`h-[25px] justify-start items-center gap-2.5 inline-flex`])}>  
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(event) => handleOnChange(event)}
                className="hidden"
                onClick={handleClick}
            />
            <label
                onClick={handleClick}
                className={`text-center text-white text-sm font-normal leading-[18px] border-principal ${sizeClass} hover:cursor-pointer`}
                htmlFor={id}>
                { content() }
            </label>
            {label && (<div className={`text-center ${label_color ? label_color : 'text-white'} text-sm font-normal leading-[18px]`}>{label}</div>)}
        </div>
    )
}

export default CheckBox