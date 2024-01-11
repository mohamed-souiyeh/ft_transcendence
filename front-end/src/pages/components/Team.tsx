
import souiyeh from "../../assets/souiyeh.jpeg";
import mounir from "../../assets/mounir.jpeg";
import github from "../../assets/github.png";
import laila from "../../assets/laila.png";
import jawaher from "../../assets/jawaher.png";
import malika from "../../assets/malika.png";



const people = [

  {
    name: "Laila Chokri",
    role: "Front-End Developer",
    imageUrl: laila,

    githubUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Malika Aamer",
    role: "Front-End Developer",
    imageUrl: malika,
    githubUrl: "https://github.com/Aamermalika",
    linkedinUrl: "https://www.linkedin.com/in/malika-aamer/",
  },
  {
    name: "Jawaher Chennak",
    role: "Back-End Developer",
    imageUrl: jawaher,
    githubUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Mohamed Souiyeh",
    role: "Back-End Developer",
    imageUrl: souiyeh,
    githubUrl: "#",
    linkedinUrl: "#",
  },
  {
    name: "Mounir Sabiri",
    role: "Full-Stack Developer",
    imageUrl: mounir,
    githubUrl: "#",
    linkedinUrl: "#",
  },
];

export default function Team() {
  return (
    <div className="bg-purple-sh-1">
      <div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24 ">
        <div className="space-y-12">
          <div className="space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
            <h2 className="-mt-8 text-3xl sm:text-4xl lg:text-5xl mb-4 md:mb-6 font-extrabold text-white tracking-tight text-center">
              Meet our team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white text-center font-light">
              The team collaborated tirelessly to craft the ultimate online web
              pong game.
              <br />
              Whether you're a seasoned pro or a beginner, enjoy the game and{" "}
              <strong className="uppercase text-violet-400 font-extrabold text-sm lg:text-base">
                start playing today!
              </strong>
            </p>
          </div>

          <ul
            role="list"
            className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:grid-cols-3 lg:gap-8"
          >
            {people.map((person) => (
              <li
                key={person.name}
                className="py-10 px-6 bg-purple-sh-0 text-center rounded-lg xl:px-10 xl:text-left hover:scale-110"
              >
                <div className="space-y-6 xl:space-y-1">
                  <img
                    className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56 bg-purple-sh-2"
                    src={person.imageUrl}
                    alt=""
                  />
                  <div className="space-y-2 xl:flex xl:items-center xl:justify-between">
                    <div className="font-medium text-lg leading-6 space-y-1">
                      <h3 className="text-white">{person.name}</h3>
                      <p className="text-indigo-400">{person.role}</p>
                    </div>

                    <ul role="list" className="flex justify-center space-x-5">
                      <li>
                        <a
                          target="_blank"
                          href={person.githubUrl}
                          className="text-gray-400 hover:text-gray-800"
                        >
                          <span className="sr-only">Github</span>
                          <img
                            src={github}
                            alt="GitHub Logo"
                            className="w-5 h-5 hover:scale-110 transition-transform duration-300 ease-in-out"
                          />
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank"
                          href={person.linkedinUrl}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
