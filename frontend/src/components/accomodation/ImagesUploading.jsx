import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ImagesUploading = ({ field }) => {
  const [imageInput, setImageInput] = useState("");

  const handleImageInputChange = (event) => {
    setImageInput(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (field.state.value.length >= 12) {
        toast.error("You can add up to 12 photos.");
        event.target.value = "";
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Choose a JPG, PNG, or WebP image.");
        event.target.value = "";
        return;
      }
      if (file.size > 500 * 1024) {
        toast.error("Each uploaded photo must be 500 KB or smaller.");
        event.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          public_id: `file_${Date.now()}`,
          url: e.target.result,
        };
        field.handleChange([...field.state.value, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = () => {
    if (field.state.value.length >= 12) {
      toast.error("You can add up to 12 photos.");
      return;
    }
    if (/^https?:\/\//i.test(imageInput.trim())) {
      const newImage = {
        public_id: `url_${Date.now()}`,
        url: imageInput.trim(),
      };
      field.handleChange([...field.state.value, newImage]);
      setImageInput("");
    } else if (imageInput) {
      toast.error("Enter a valid http or https image URL.");
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...field.state.value];
    updatedImages.splice(index, 1);
    field.handleChange(updatedImages);
  };

  return (
    <div className="photos-container">
        <h4 className="photos-header">Photos</h4>
      <label className="form-labels">Add up to 12 photos (500 KB each)</label>

      <div className="image-link-container">
        <input
          className="image-link"
          type="text"
          placeholder="Add using link /.jpg"
          onChange={handleImageInputChange}
          value={imageInput}
        />
        <button className="add-button" type="button" onClick={handleAddImage}>
          Add
        </button>
      </div>

      <div className="image-list-container">
        {field.state.value.map((imageObj, index) => (
          <div key={index} className="image-preview-box">
            <img
              alt={`Image-${index}`}
              src={imageObj.url}
              className="preview-image"
              height="200px"
              width="200px"
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className="delete-btn"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        <label className="upload">
          <input
            type="file"
          accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="material-symbols-outlined">upload</span>
          Upload Photo
        </label>
      </div>
    </div>
  );
};

export default ImagesUploading;
