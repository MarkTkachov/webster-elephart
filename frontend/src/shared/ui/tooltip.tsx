import { useState } from 'react';

const TooltipIcon = ({
    icon: Icon,
    tooltipText,
    imgSrc,
    onClick,
}: {
    icon: React.ComponentType<any>;
    tooltipText: {
        title: string;
        description: string;
        shortcut: string;
    };
    imgSrc: string;
    onClick: () => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative flex h-10 w-full items-center justify-center">
            <div
                className="cursor-pointer p-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <Icon className="h-6 w-6 text-foreground" />
            </div>
            {isHovered && (
                <div className="absolute left-full top-1/2 z-10 ml-2 w-64 -translate-y-1/2 bg-background transform rounded-lg shadow-lg animate-jump-in animate-once animate-duration-300 animate-delay-300 animate-ease-out">
                    <img
                        src={imgSrc}
                        alt="Description"
                        className="mb-2 w-full rounded-t-lg"
                    />
                    <div className='p-2 text-foreground'>
                        <h3 className="font-bold">{tooltipText.title}</h3>
                        <p className='text-sm'>{tooltipText.description}</p>
                        <p className="text-sm text-gray-500">
                            {tooltipText.shortcut}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TooltipIcon;
