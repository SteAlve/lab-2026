import Button from "react-bootstrap/Button";

function AddFilmButton() {
  return (
    <Button
      className="rounded-circle position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center"
      style={{ width: "56px", height: "56px" }}
      aria-label="Add film"
    >
      <i className="bi bi-plus-lg fs-5"></i>
    </Button>
  );
}

export default AddFilmButton;