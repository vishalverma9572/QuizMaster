const LogoutConfirmation = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>

      {/* Updated the flexbox alignment to shift the block left by 60% */}
      <div className="fixed inset-0 flex items-center justify-start z-50" style={{ marginLeft: '45%' }}>
        <div className="bg-[#2D3B45] text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
          <p className="text-md mb-6">
            You are about to log out of your account. Any unsaved changes will be lost.
          </p>
          <div className="flex justify-end">
            <button
              className="bg-[#212C34] text-white px-4 py-2 rounded mr-2 hover:bg-gray-900"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={onConfirm}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutConfirmation;
