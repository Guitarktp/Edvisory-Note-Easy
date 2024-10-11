'use client'

import React from "react";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import DropdownList from "./dropdown.jsx";
import axiosInstance from "@/lib/axiosInstance";
import TagInput from "./tagInput.jsx";



const AddEditNotes = ({
  noteData,
  type,
  onClose,
  getAllNotes,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [author, setAuthor] = useState(noteData?.author || "");
  const [category, setCategory] = useState(noteData?.category || "personal");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post("/features/add-note", {
        title,
        content,
        author,
        category,
        tags,
      });

      // if (response.data && response.data.noteInfo) {
      if (response.data) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        "/features/edit-note/" + noteId,
        {
          title,
          content,
          author,
          category,
          tags,
        }
      );

      if (response.data && response.data.noteInfo) {
        
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    if (!author) {
      setError("Please enter the author name");
      return;
    }
    if (!category) {
      setError("Please enter the category");
      return;
    }
    setError("");
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Add your title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>


      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Author</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Add your name"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>


      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Category</label>
        <DropdownList 
          categoryList={category}
          setCategoryList={setCategory}  
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        {type === "add" ? "ADD" : "Update"}
      </button>
    </div>
  );
};

export default AddEditNotes;
