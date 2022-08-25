/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
    label: string;
    value: any;
};

const ViewOnlyFields = ({ label, value }: Props) => (
    <div>
        <label>
            <b>{label ?? 'Label'}</b>
        </label>
        <p>{value ?? '--'}</p>
    </div>
);

export default ViewOnlyFields;
