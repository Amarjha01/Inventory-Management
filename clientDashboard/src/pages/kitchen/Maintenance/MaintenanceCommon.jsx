import React, { useEffect, useState } from "react";
import {
  FiCamera,
  FiUpload,
  FiX,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";

/* ============================================================
   DATE HELPERS
============================================================ */

export const formatDate = (date) => {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return value.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatInputDate = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toISOString().split("T")[0];
};

/* ============================================================
   INPUT
============================================================ */

export const Input = ({
  label,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-(--theme-text)">
        {label}
      </span>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-(--theme-text-muted)
            "
          />
        )}

        <input
          {...props}
          className={`
            h-11
            w-full
            rounded-xl
            border
            border-(--theme-border)
            bg-(--theme-background)
            px-3
            text-sm
            text-(--theme-text)
            outline-none
            transition
            placeholder:text-(--theme-text-muted)
            focus:border-(--theme-primary)
            focus:ring-2
            focus:ring-(--theme-primary)/10
            ${Icon ? "pl-9" : ""}
            ${className}
          `}
        />
      </div>
    </label>
  );
};

/* ============================================================
   TEXTAREA
============================================================ */

export const Textarea = ({
  label,
  ...props
}) => {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-(--theme-text)">
        {label}
      </span>

      <textarea
        {...props}
        rows={4}
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-(--theme-border)
          bg-(--theme-background)
          px-3
          py-3
          text-sm
          text-(--theme-text)
          outline-none
          transition
          placeholder:text-(--theme-text-muted)
          focus:border-(--theme-primary)
          focus:ring-2
          focus:ring-(--theme-primary)/10
        "
      />
    </label>
  );
};

/* ============================================================
   CAPTURE ACTIONS
============================================================ */

export const CaptureActions = ({
  onCamera,
  onFiles,
  label = "Add Image",
  accept = "image/*",
  multiple = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onCamera}
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-(--theme-primary)
          bg-(--theme-primary)/5
          px-3
          py-3
          text-xs
          font-medium
          text-(--theme-primary)
          transition
          hover:bg-(--theme-primary)/10
        "
      >
        <FiCamera size={17} />
        Camera
      </button>

      <label
        className="
          flex
          cursor-pointer
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-(--theme-border)
          bg-(--theme-surface)
          px-3
          py-3
          text-xs
          font-medium
          text-(--theme-text)
          transition
          hover:bg-(--theme-muted)
        "
      >
        <FiUpload size={16} />
        Upload

        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onFiles}
        />
      </label>
    </div>
  );
};

/* ============================================================
   IMAGE PREVIEW
============================================================ */

export const ImagePreview = ({
  image,
  onRemove,
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    if (typeof image === "string") {
      setPreview(image);
      return;
    }

    const url = URL.createObjectURL(image);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  if (!preview) {
    return null;
  }

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-(--theme-border)
        bg-black/5
      "
    >
      <img
        src={preview}
        alt="Maintenance attachment"
        className="h-36 w-full object-cover"
      />

      <button
        type="button"
        onClick={onRemove}
        className="
          absolute
          right-2
          top-2
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-black/60
          text-white
          backdrop-blur
          transition
          hover:bg-red-600
        "
      >
        <FiX size={15} />
      </button>
    </div>
  );
};

/* ============================================================
   IMAGE SECTION
============================================================ */

export const ImageSection = ({
  title,
  subtitle,
  images = [],
  maxImages,
  onCamera,
  onFiles,
  onRemove,
}) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-(--theme-text)">
            {title}
          </p>

          <p className="mt-0.5 text-[11px] text-(--theme-text-muted)">
            {subtitle}
          </p>
        </div>

        <span
          className="
            rounded-full
            bg-(--theme-muted)
            px-2
            py-1
            text-[10px]
            font-medium
            text-(--theme-text-muted)
          "
        >
          {images.length}/{maxImages}
        </span>
      </div>

      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <CaptureActions
          onCamera={onCamera}
          onFiles={onFiles}
          accept="image/*"
          multiple
          label="Add Image"
        />
      )}
    </div>
  );
};

/* ============================================================
   SINGLE IMAGE FIELD
============================================================ */

export const SingleImageField = ({
  title,
  subtitle,
  image,
  onCamera,
  onFiles,
  onRemove,
}) => {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-(--theme-text)">
        {title}
      </p>

      {subtitle && (
        <p className="mb-2 text-[11px] text-(--theme-text-muted)">
          {subtitle}
        </p>
      )}

      {image ? (
        <ImagePreview
          image={image}
          onRemove={onRemove}
        />
      ) : (
        <CaptureActions
          onCamera={onCamera}
          onFiles={onFiles}
          accept="image/*"
          label="Add Image"
        />
      )}
    </div>
  );
};

/* ============================================================
   DETAIL ITEM
============================================================ */

export const DetailItem = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div
      className="
        flex
        gap-3
        rounded-xl
        bg-(--theme-muted)
        p-3
      "
    >
      {Icon && (
        <Icon
          size={15}
          className="
            mt-0.5
            shrink-0
            text-(--theme-primary)
          "
        />
      )}

      <div className="min-w-0">
        <p
          className="
            text-[10px]
            uppercase
            tracking-wider
            text-(--theme-text-muted)
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            break-words
            text-xs
            font-medium
            text-(--theme-text)
          "
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

/* ============================================================
   RECORD IMAGES
============================================================ */

export const RecordImages = ({
  images = [],
  title = "Images",
}) => {
  if (!images.length) return null;

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center gap-2">
        <FiImage
          size={14}
          className="text-(--theme-primary)"
        />

        <span className="text-xs font-medium text-(--theme-text)">
          {title}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <a
            key={index}
            href={image}
            target="_blank"
            rel="noreferrer"
            className="
              block
              overflow-hidden
              rounded-xl
              border
              border-(--theme-border)
            "
          >
            <img
              src={image}
              alt={`Maintenance ${index + 1}`}
              className="
                h-36
                w-full
                object-cover
                transition
                hover:scale-105
              "
            />
          </a>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   EMPTY STATE
============================================================ */

export const EmptyState = ({
  icon: Icon,
  title,
  text,
  onAdd,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-2xl
        border
        border-dashed
        border-(--theme-border)
        bg-(--theme-surface)
        px-5
        py-12
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-(--theme-primary)/10
          text-(--theme-primary)
        "
      >
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-(--theme-text)">
        {title}
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-(--theme-text-muted)">
        {text}
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-(--theme-primary)
          px-4
          py-2.5
          text-xs
          font-semibold
          text-white
          transition
          hover:opacity-90
        "
      >
        <FiPlus size={15} />
        Add Record
      </button>
    </motion.div>
  );
};