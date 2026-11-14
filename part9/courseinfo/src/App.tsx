interface CoursePartBase {
  name: string,
  exerciseCount: number
}

interface CoursePartBaseExtended extends CoursePartBase {
  description: string,
}

interface CoursePartBasic extends CoursePartBaseExtended {
  kind: 'basic'
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number,
  kind: 'group'
}

interface CoursePartBackground extends CoursePartBaseExtended {
  backgroundMaterial: string,
  kind: 'background'
}

interface CoursePartSpecial extends CoursePartBaseExtended {
  requirements: string[],
  kind: 'special'
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface ContentProps {
  parts: CoursePart[]
}

interface PartProps {
  part: CoursePart
}



const Header = ({ name }: { name: string }) => {
  return (
    <h2>{name}</h2>
  );
};

const Part = ({ part }: PartProps) => {
  let additionalPartContent;
  switch(part.kind) {
    case 'basic':
      break;
    case 'group':
      additionalPartContent = <p>project exercises {part.groupProjectCount}</p>;
      break;
    case 'background':
      additionalPartContent = <p>submit to <a href={part.backgroundMaterial} target='_blank'>
          {part.backgroundMaterial}
        </a></p>;
      break;
    case 'special':
      additionalPartContent = <p>required skills: {part.requirements.join(', ')}</p>;
      break;
    default:
      { 
        const remaining: never =  part;
        throw new Error(`Undefined type of course part ${JSON.stringify(remaining)}`);
      }
  }
  return (
    <div>
      <h4>{part.name} {part.exerciseCount}</h4>
      {'description' in part/*part.kind !== 'group'*/ ? (<em>{part.description}</em>) : null}
      {additionalPartContent}
    </div>
  );
};

const Content = ({ parts }: ContentProps ) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

const Total = ({ total }: { total: number }) => {
  return (
    <div>Total exercises: {total}</div>
  );
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts}/>
      <Total total={totalExercises}/>
    </div>
  );
};

export default App;