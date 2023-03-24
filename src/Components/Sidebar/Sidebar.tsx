import './Sidebar.css';
import { Button } from '../UI/Buttons/Button/Button';
import { ButtonGroup } from '../UI/Buttons/ButtonGroup/ButtonGroup';
import { Checkbox } from '../UI/Checkboxes/Checkbox/Checkbox';
import { CheckboxGroup } from '../UI/Checkboxes/CheckboxGroup/CheckboxGroup';

interface Props {
    onClick(id: string, value: boolean): void;
    temperatureIsSelected: boolean;
    precipitationIsSelected: boolean;
}
function Sidebar(props: Props) {
    const { temperatureIsSelected, precipitationIsSelected } = props;

    return (
        <aside className={'sidebar'}>
            <CheckboxGroup direction={'column'}>
                <Checkbox
                    fullWidth
                    id={'temperature'}
                    label={'Температура'}
                    isSelected={temperatureIsSelected}
                    onClick={() => {
                        props.onClick('temperature', !temperatureIsSelected);
                    }}
                />
                <Checkbox
                    fullWidth
                    id={'precipitation'}
                    label={'Осадки'}
                    isSelected={precipitationIsSelected}
                    onClick={() => {
                        props.onClick(
                            'precipitation',
                            !precipitationIsSelected,
                        );
                    }}
                />
            </CheckboxGroup>
        </aside>
    );
}

export default Sidebar;
