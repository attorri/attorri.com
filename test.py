
class Person:
    def __init__(self, name, age, gender, height, weight, hair_color):
        self.name = name
        self.age = age
        self.gender = gender
        self.height = height
        self.weight = weight
        self.hair_color = hair_color
    
    def professional_summary(self):
        return f"Name: {self.name}, Age: {self.age}, Gender: {self.gender}, Height: {self.height}cm, Weight: {self.weight}kg, Hair Color: {self.hair_color}"
   
   
   

def main():
    person = Person(hair_color="brown", age=23, gender="male", height=180, weight=70, name="Chris")
    print(person.professional_summary())

if __name__ == "__main__":
    main()
    
    
