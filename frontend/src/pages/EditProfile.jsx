import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user: currentUser, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: "",
  });
  const [uploadMode, setUploadMode] = useState("url"); // "url" or "file"
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "Vikas",
        bio: currentUser.bio || "MERN STACK DEVELOPER",
        profilePic:
          currentUser.profilePic ||
          "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
      });
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSend;
      let headers = {};

      if (uploadMode === "file" && selectedFile) {
        dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        dataToSend.append("bio", formData.bio);
        dataToSend.append("profilePic", selectedFile);
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        dataToSend = formData;
      }

      const { data } = await API.put("/users/profile", dataToSend, { headers });
      setUser(data); // Sync local state
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl shadow-xl mt-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 flex items-center">
        Edit <span className="text-blue-600 ml-2 italic">Profile</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-wider">
            Full Name
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 ml-1 uppercase tracking-wider">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition min-h-[120px]"
            placeholder="Tell the world about yourself..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
            Profile Picture
          </label>

          <div className="flex p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setUploadMode("url")}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${uploadMode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("file")}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${uploadMode === "file" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Upload File
            </button>
          </div>

          {uploadMode === "url" ? (
            <input
              value={formData.profilePic}
              onChange={(e) =>
                setFormData({ ...formData, profilePic: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="https://example.com/photo.jpg"
            />
          ) : (
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profilePic-upload"
              />
              <label
                htmlFor="profilePic-upload"
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                {selectedFile ? (
                  <div className="flex items-center space-x-3">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <span className="font-medium text-gray-700 truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <svg
                      className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2 transition"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span className="text-gray-500 font-medium group-hover:text-blue-600 transition">
                      Choose image from device
                    </span>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all transform active:scale-95 shadow-lg shadow-blue-100 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-1"
            }`}
          >
            {loading ? "Saving Changes..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
