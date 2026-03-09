import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl mt-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 flex items-center">
        Share a <span className="text-blue-600 ml-2 italic">Moment</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <label className="block w-full border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-400 transition group-hover:bg-blue-50/50">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 mx-auto rounded-xl shadow-sm"
              />
            ) : (
              <div className="py-12 flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-3 text-blue-600 transition group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-semibold text-lg">
                  Click to upload photo
                </p>
                <p className="text-gray-400 text-sm">JPEG, PNG or JPG</p>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition min-h-[120px]"
            placeholder="Write something amazing..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all transform active:scale-95 shadow-lg shadow-blue-100 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1"
          }`}
        >
          {loading ? "Sharing..." : "Post Now"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
