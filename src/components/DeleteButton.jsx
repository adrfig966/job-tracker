import { useState } from "react";
import TrashIcon from "jsx:../svg/trash-solid.svg";

const DeleteButton = ({ ondelete }) => {
  const [confirmdelete, setConfirmDelete] = useState(false);
  const handleDelete = () => {
    ondelete();
  };
  return (
    <>
      {!confirmdelete ? (
        <button onClick={() => setConfirmDelete(true)}>
          <TrashIcon />
        </button>
      ) : (
        <button
          className="confirm-btn"
          onClick={() => {
            handleDelete();
            setConfirmDelete(false);
          }}
        >
          <TrashIcon />
        </button>
      )}
    </>
  );
};

export default DeleteButton;
