Create Auction Page
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Redirect from "../Components/Redirect";

const BASE_URL = "https://dynamic-auction-system.vercel.app/api";

const CreateAuctionPage = () => {
  const [itemName, setItemName] = useState("");
  const [images, setImages] = useState([]);
  const [startingPrice, setStartingPrice] = useState(100);
  const [auctionTime, setAuctionTime] = useState(24);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const cloudName = "dmgnrl8zf";
  const uploadPreset = "Auction_System";

  const handleTagAdd = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      const imageUploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );
        return response.data.secure_url;
      });

      const uploadedImages = await Promise.all(imageUploadPromises);
      setImages((prevImages) => [...prevImages, ...uploadedImages]);
    } catch (err) {
      console.error("Error uploading images:", err);
      setErrors((prevErrors) => ({ ...prevErrors, imageUpload: "Failed to upload images. Please try again." }));
    }

    setUploading(false);
  };

  const handleImageRemove = (imageUrl) => {
    setImages(images.filter((url) => url !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!itemName.trim()) {
      validationErrors.itemName = "Item Name is required.";
                      className="text-red-500"
                      onClick={() => handleTagDelete(tag)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
