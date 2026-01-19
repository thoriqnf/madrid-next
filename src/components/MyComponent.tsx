interface Props {
  title: string;
  subTitle: string;
  image?: string | [];
}

const MyComponent: React.FC<Props> = ({ title }) => {
  const name: string = "nama saya Thoriq";
  const count: number = 22;
  const isDarkMode: boolean = true;
  const library: string[] = ["next js", "react", "nest js"];
  const user: { name: string; age?: number } = { name: "revou", age: 5 };

  return (
    <div>
      <h1>My Component</h1>
      <h1>My {title}</h1>
    </div>
  );
};

export default MyComponent;
