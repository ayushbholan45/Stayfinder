'use client';
import Image from "next/image";

import Modal from "./Modal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal";
import LoginModal from "./LoginModal";

const AddPropertyModal = () => {
    const addPropertyModal = useAddPropertyModal();

    return (
        <>
            <Modal 
                isOpen={addPropertyModal.isOpen}
                close={addPropertyModal.close}
                label="Add property"
                content={(
                    <p>hehe</p>
                )}
            />
        </>
    )
}

export default AddPropertyModal