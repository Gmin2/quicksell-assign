// Have introduced the Customer type so that we have a good typed system from begining
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  score: number;
  lastMessageAt: Date;
  addedBy: string;
  avatar: string;
}

/**
 * 
 * Note: Instead of repeateting the same name `Customer Name` and same email `johndoee@gmail.com` for all the customers as given in the assignment, I have created a function that generates a random customer from randomly picking firstnames and lastnames from the array that I have created above
 * 
 */


// some first names and last names of my friend that added so that the below `generateCustomers` can use this name and form the data reqd for the assignment
const firstNames = [
  'Mintu', 'Milan', 'Arjunav', 'Shantanu', 'Rahul', 'Prashant', 'Nishant',
  'Ravi', 'Rajesh', 'Prasanna', 'Nikhil', 'Vijay', 'Rahul', 'Arjun', 'Piyush',
];

const lastNames = [
    'Gogoi', 'Vijay', 'Kumar', 'Singh', 'Patel', 'Chauhan', 'Sharma', 'Kulkarni',
    'Rathore', 'Arora', 'Mohd', 'Raj', 'Tripathi', 'Saikia', 'Meena'
]

// generate a random customer from randomly picking firstnames and lastnames from the array that I have created above 
function generateCustomer(id: number): Customer {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  // generate email from name
  const email = `${firstName?.toLowerCase()}.${lastName?.toLowerCase()}${id}@example.com`;
  
  // generate phone number 
  const phone = `+91 ${Math.floor(Math.random() * 10000000000)}`;
  
  // generate score (0-100)
  const score = Math.floor(Math.random() * 101);
  
  // generate last message date (within last 2 years)
  const lastMessageAt = new Date(
    Date.now() - Math.floor(Math.random() * 730 * 24 * 60 * 60 * 1000)
  );
  
  const addedBy = `${firstName} ${lastName}`;
  
  // generate avatar using DiceBear API
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
  
  return {
    id,
    name,
    phone,
    email,
    score,
    lastMessageAt,
    addedBy,
    avatar
  };
}

// generate all customers at once (default 1 million)
export function generateCustomers(count: number = 1000000): Customer[] {
  console.time('Generating customers');
  const customers: Customer[] = [];
  
  for (let i = 1; i <= count; i++) {
    customers.push(generateCustomer(i));
  }
  
  console.timeEnd('Generating customers');
  return customers;
}
