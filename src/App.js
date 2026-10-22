import './App.css';
import Counter from "./components/ui/Counter";
import Card from "./components/ui/Card";
import Button from "./components/ui/Button";
import Form from "./components/ui/Form";
import List from "./components/ui/List";

function App() {
  return (
    <>
    <h1>hello akinn</h1>
    <Button/>
    <Card 
    name="HANNAH"
    description="Hannah anona hhahaa"
    />
    <Form/>
      <Counter />
      <List/>
    </>
  );
}

export default App;