const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Connection error', error);
    process.exit(1);
  }
};

const subjects = [
  {
    name: 'Mathematics',
    description: 'Master numbers, formulas, and problem-solving skills from basic arithmetic to advanced calculus.',
    icon: 'FaCalculator',
    topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry']
  },
  {
    name: 'Science',
    description: 'Explore the natural world, physical laws, and biological systems.',
    icon: 'FaFlask',
    topics: ['Physics', 'Chemistry', 'Biology', 'Astronomy', 'Earth Science']
  },
  {
    name: 'English',
    description: 'Improve your grammar, literature comprehension, and writing skills.',
    icon: 'FaBook',
    topics: ['Grammar', 'Literature', 'Creative Writing', 'Poetry', 'Vocabulary']
  },
  {
    name: 'Coding',
    description: 'Learn programming languages, algorithms, and software development.',
    icon: 'FaCode',
    topics: ['JavaScript', 'Python', 'Data Structures', 'Web Development', 'React']
  }
];

const seedDB = async () => {
  await connectDB();
  
  try {
    await Subject.deleteMany();
    await Subject.insertMany(subjects);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

seedDB();
