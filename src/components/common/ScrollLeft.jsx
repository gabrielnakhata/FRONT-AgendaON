import { IconButton } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';

const ScrollLeft = ({ target, threshold = 100, className = '', icon = <ArrowLeftIcon />, ...props }) => {

    const handleScroll = () => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <IconButton
            className={className}
            icon={icon}
            onClick={handleScroll}
            {...props}
        />
    );
};

export default ScrollLeft;
