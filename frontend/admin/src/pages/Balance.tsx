import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import addTeacherBalance from "../../utils/addTeacherBalance";
import allBalance from "../../utils/allBalances";
type TeacherT = {
  _id: string;
  role: string;
  balance: number;
  userId: {
    _id: string;
    name: string;
  };
};

const Balance = () => {
  const [teachers, setTeachers] = useState<TeacherT[]>([]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [addBalance, setAddBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeacherBalances = async () => {
      try {
        const response = await allBalance();
        const data = response.data.data.balances;
        const teachersList = data.filter((user: TeacherT) => {
          return user.role === "teacher";
        });
        setTeachers(teachersList);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching teachers.");
      }
    };
    fetchTeacherBalances();
  }, []);

  const handleAddBalance = async (teacherId: string) => {
    if (addBalance <= 0) {
      toast.error("Please enter a valid amount to add.");
      return;
    }

    setLoading(true);
    try {
      const response = await addTeacherBalance(teacherId, addBalance);
      if (response.status === 200) {
        setTeachers((prev) => {
          console.log(prev, "previous");

          return prev.map((teacher) => {
            if (teacher.userId._id === teacherId) {
              console.log(teacher.balance, addBalance);
              return {
                ...teacher,
                balance: teacher.balance + addBalance,
              };
            }
            return teacher;
          });
        });
      }
      setAddBalance(0);

      toast.success("Balance added successfully!");
    } catch (error) {
      toast.error("Error adding balance.");
      console.error("Error while adding balance:", error);
    } finally {
      setLoading(false);
      setAddBalance(0);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-gray-800 h-screen">
      <h1 className="text-4xl font-semibold mb-8 text-center text-yellow-400">
        Teacher Balances
      </h1>

      <div className="space-y-4">
        {teachers.map((teacher) => (
          <div
            key={teacher._id}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
          >
            <div className="text-yellow-300">{teacher.userId.name}</div>
            <div className="text-yellow-300">${teacher.balance}</div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                className="px-4 py-2 rounded-lg bg-gray-600 text-yellow-300 outline-none"
                placeholder="Amount to Add"
                onChange={(e) => setAddBalance(Number(e.target.value))}
              />
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                onClick={() => {
                  setSelectedTeacherId(teacher._id);
                  handleAddBalance(teacher.userId._id);
                }}
                disabled={
                  loading ||
                  (selectedTeacherId === teacher._id && addBalance <= 0)
                }
              >
                {loading ? "Adding..." : "Add Balance"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Balance;
