import { PropsWithChildren } from 'react';
import './CheckboxGroup.css';

interface Props {
    direction?: 'row' | 'column';
    bordered?: boolean;
}

export const CheckboxGroup = (props: Props & PropsWithChildren) => {
    const { direction, bordered } = props;
    let classNames = 'checkbox-group';
    if (direction === 'column')
        classNames = `${classNames} checkbox-group--column`;
    if (bordered) classNames = `${classNames} checkbox-group--bordered`;

    return <div className={classNames}>{props.children}</div>;
};
