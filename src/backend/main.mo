import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  type Course = {
    id : Nat;
    name : Text;
    faculty : Text;
    description : Text;
    setId : Nat;
    dateRange : Text;
    maxSeats : Nat;
    registeredCount : Nat;
  };

  type StudentRegistration = {
    studentId : Text;
    name : Text;
    email : Text;
    courseSet1Id : Nat;
    courseSet2Id : Nat;
  };

  module Course {
    public func compare(course1 : Course, course2 : Course) : Order.Order {
      Nat.compare(course1.id, course2.id);
    };
  };

  module StudentRegistration {
    public func compare(s1 : StudentRegistration, s2 : StudentRegistration) : Order.Order {
      Text.compare(s1.studentId, s2.studentId);
    };
  };

  var adminPassword : Text = "kmct2025admin";

  let courses = Map.fromIter<Nat, Course>([
    (
      1,
      {
        id = 1;
        name = "Toy Design";
        faculty = "Ali Asgar";
        description = "Design and create unique toys.";
        setId = 1;
        dateRange = "April 28 - May 8";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      2,
      {
        id = 2;
        name = "Basics of VFX";
        faculty = "Arjun";
        description = "Learn the basics of visual effects.";
        setId = 1;
        dateRange = "April 28 - May 8";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Ceramic Design";
        faculty = "Abhishek Tiwari";
        description = "Explore ceramic design techniques.";
        setId = 1;
        dateRange = "April 28 - May 8";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      4,
      {
        id = 4;
        name = "Illustration Techniques";
        faculty = "Roney Devassia";
        description = "Enhance your illustration skills.";
        setId = 1;
        dateRange = "April 28 - May 8";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      5,
      {
        id = 5;
        name = "Craft Design";
        faculty = "Bavith Balakrishnan";
        description = "Innovative craft design projects.";
        setId = 2;
        dateRange = "May 11 - May 22";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      6,
      {
        id = 6;
        name = "Advance Photography";
        faculty = "Jagath Narayanan";
        description = "Master advanced photography techniques.";
        setId = 2;
        dateRange = "May 11 - May 22";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      7,
      {
        id = 7;
        name = "Icon Design";
        faculty = "Rishita";
        description = "Create stunning icons and graphics.";
        setId = 2;
        dateRange = "May 11 - May 22";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
    (
      8,
      {
        id = 8;
        name = "Paper Making";
        faculty = "Hashim";
        description = "Learn the art of paper making.";
        setId = 2;
        dateRange = "May 11 - May 22";
        maxSeats = 19;
        registeredCount = 0;
      },
    ),
  ].values());

  let studentRegistrations = Map.empty<Text, StudentRegistration>();

  public shared ({ caller }) func verifyAdminPassword(password : Text) : async Bool {
    password == adminPassword;
  };

  public shared ({ caller }) func getAllRegistrations(password : Text) : async [StudentRegistration] {
    if (password == adminPassword) {
      studentRegistrations.values().toArray().sort();
    } else {
      [];
    };
  };

  public shared ({ caller }) func clearAllRegistrations(password : Text) : async Bool {
    if (password != adminPassword) { return false };
    // Remove all student registrations
    for (studentId in studentRegistrations.keys().toArray().values()) {
      ignore studentRegistrations.remove(studentId);
    };
    // Reset all course registration counts to 0
    for (courseId in courses.keys().toArray().values()) {
      switch (courses.get(courseId)) {
        case (?c) {
          courses.add(courseId, { c with registeredCount = 0 });
        };
        case (null) {};
      };
    };
    true;
  };

  public shared ({ caller }) func updateCourse(
    password : Text,
    courseId : Nat,
    name : Text,
    faculty : Text,
    description : Text,
    dateRange : Text,
  ) : async Bool {
    if (password != adminPassword) { return false };

    switch (courses.get(courseId)) {
      case (null) { return false };
      case (?existingCourse) {
        let updatedCourse : Course = {
          existingCourse with
          name;
          faculty;
          description;
          dateRange;
        };
        courses.add(courseId, updatedCourse);
        true;
      };
    };
  };

  public shared ({ caller }) func changeAdminPassword(
    oldPassword : Text,
    newPassword : Text,
  ) : async Bool {
    if (oldPassword != adminPassword) { return false };
    adminPassword := newPassword;
    true;
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    courses.values().toArray().sort();
  };

  public query ({ caller }) func getCoursesBySet(setId : Nat) : async [Course] {
    courses.values().toArray().sort().filter(func(course) { course.setId == setId });
  };

  public shared ({ caller }) func registerStudent(
    studentId : Text,
    name : Text,
    email : Text,
    courseSet1Id : Nat,
    courseSet2Id : Nat,
  ) : async Text {
    if (studentRegistrations.containsKey(studentId)) {
      return "The student is already registered for the summer course.";
    };

    let course1 = getCourseByID(courseSet1Id);
    if (switch (course1) { case (null) { true }; case (_) { false } }) {
      return "The course does not exist. (ID " # courseSet1Id.toText() # "does not exist)";
    };

    let course2 = getCourseByID(courseSet2Id);
    if (switch (course1) { case (null) { true }; case (_) { false } }) {
      return "The course does not exist. (ID " # courseSet2Id.toText() # "does not exist)";
    };

    switch (course1, course2) {
      case (?c1, ?c2) {
        if (c1.registeredCount >= c1.maxSeats) {
          return "Course set 1 is full.";
        };
        if (c2.registeredCount >= c2.maxSeats) {
          return "Course set 2 is full.";
        };

        courses.add(courseSet1Id, { c1 with registeredCount = c1.registeredCount + 1 });
        courses.add(courseSet2Id, { c2 with registeredCount = c2.registeredCount + 1 });

        let newRegistration : StudentRegistration = {
          studentId;
          name;
          email;
          courseSet1Id;
          courseSet2Id;
        };
        studentRegistrations.add(studentId, newRegistration);
        "Registration successful!";
      };
      case (_) { "Unexpected error occurred!" };
    };
  };

  func getCourseByID(courseId : Nat) : ?Course {
    courses.get(courseId);
  };
};
