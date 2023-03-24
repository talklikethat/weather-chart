import { PropsWithChildren } from 'react';
import './ButtonGroup.css';

interface Props {
    direction?: 'row' | 'column';
}

export const ButtonGroup = (props: Props & PropsWithChildren) => {
    const { direction } = props;
    let classNames = 'button-group';
    if (direction === 'column')
        classNames = `${classNames} button-group--column`;

    return <div className={classNames}>{props.children}</div>;
};
