interface CustomButtonProps {
    label: string;
    className?: string,
    onClick: () => void;
}

const CustomButtons: React.FC<CustomButtonProps> = ({ label, className, onClick }) => { 
  return (
    <div
        onClick={onClick}
        className={`py-4 bg-stayfinder hover:bg-stayfinder-dark text-white text-center rounded-xl transition cursor-pointer ${ className }`}>
        
        { label }
    </div>
  )
}

export default CustomButtons
