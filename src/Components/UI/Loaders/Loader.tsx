import './Loader.css';

export const TextLoader = ({ text = 'Загрузка...' }) => {
    return <div className="loader">{text}</div>;
};
