import { motion } from "framer-motion";

const PageHeader = ({ title, subtitle, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative
        mb-4
        min-h-26
        overflow-hidden
        rounded-t-2xl
        z-0
        bg-[var(--theme-header)]

        px-4
        py-3

        shadow-[0_5px_18px_rgba(0,0,0,0.12)]

        transition-colors
        duration-500

        sm:mb-5
        sm:min-h-26
        sm:rounded-t-[20px]
        sm:px-6
        sm:py-4
      "
    >

      {/* ================= HEADER OVERLAY ================= */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-r
          from-black/10
          via-transparent
          to-[var(--theme-primary)]/10
        "
      />

      {/* ================= DECORATIVE STARS ================= */}
      <span
        className="
          absolute
          left-7
          top-4
          h-1
          w-1
          rounded-full
          bg-[var(--theme-primary)]/60
        "
      />

      <span
        className="
          absolute
          left-16
          top-8
          h-0.5
          w-0.5
          rounded-full
          bg-[var(--theme-primary-light)]/70
        "
      />

      <span
        className="
          absolute
          left-[42%]
          top-5
          h-1
          w-1
          rounded-full
          bg-[var(--theme-primary-light)]/30
        "
      />

      {/* ================= TEXT ================= */}
      <div
        className="
          relative
          z-10
          max-w-[62%]

          sm:max-w-[55%]
        "
      >
        <h1
          className="
            mt-0.5
            text-[23px]
            font-extrabold
            leading-tight
            text-[var(--theme-primary-light)]

            transition-colors
            duration-500

            sm:mt-1
            sm:text-[30px]
          "
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="
              mt-1
              line-clamp-2
              text-[9px]
              font-medium
              leading-3.5
              text-white/80

              transition-colors
              duration-500

              sm:mt-2
              sm:text-[12px]
              sm:leading-4
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* ================= HERO IMAGE ================= */}
      {imageUrl && (
        <div
          className="
            absolute
            bottom-0
            right-0
            z-10
            flex
            h-full
            w-[43%]
            items-end
            justify-end

            sm:w-[42%]
          "
        >
          <img
            src={imageUrl}
            alt=""
            className="
              h-full
              w-full
              object-contain
              object-right-bottom
              transition-transform
              duration-500
            "
          />
        </div>
      )}

      {/* ================= THEME GLOW ================= */}
      <div
        className="
          pointer-events-none
          absolute
          right-[32%]
          top-1/2
          h-16
          w-16
          -translate-y-1/2
          rounded-full
          bg-[var(--theme-primary)]/15
          blur-2xl

          transition-colors
          duration-500

          sm:h-20
          sm:w-20
        "
      />
    </motion.div>
  );
};

export default PageHeader;