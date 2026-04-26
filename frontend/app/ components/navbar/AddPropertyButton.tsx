'use client';
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal"

import useLoginModal from "@/app/hooks/useLoginModal";


interface AddPropertyButtonProps {
  userId?: string | null ;

}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userId }) => {

  const loginModal = useLoginModal();
  const addPropertyModal = useAddPropertyModal();


  const stayfinderYourHome = () => {
    if(userId){
      addPropertyModal.open()
    } else{
      loginModal.open();
    }
  }
  return (
    <div 
      onClick={stayfinderYourHome}
      className="cursor-pointer  text-sm font-semibold rounded-full hover:bg-gray-200">

      <p>Switch to hosting</p>
    </div>
  )
}

export default AddPropertyButton
