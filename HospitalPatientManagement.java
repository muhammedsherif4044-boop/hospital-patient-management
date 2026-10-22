import java.util.Scanner;

public class HospitalPatientManagement {

    static class Patient {
        int id, age;
        String name, gender, disease, phone, doctor;

        Patient(int id, String name, int age, String gender, String disease, String phone, String doctor) {
            this.id = id; this.name = name; this.age = age; this.gender = gender;
            this.disease = disease; this.phone = phone; this.doctor = doctor;
        }

        public String toString() {
            return id + " | " + name + " | " + age + " | " + gender + " | " + disease + " | " + phone + " | " + doctor;
        }
    }

    static class Node {
        Patient data;
        Node next;
        Node(Patient data) { this.data = data; }
    }

    // Singly linked list used for both the records and the waiting queue
    static class PatientList {
        Node head, tail;
        int size;

        void addLast(Patient p) {
            Node n = new Node(p);
            if (head == null) head = tail = n;
            else { tail.next = n; tail = n; }
            size++;
        }

        Patient removeFirst() {
            if (head == null) return null;
            Patient p = head.data;
            head = head.next;
            if (head == null) tail = null;
            size--;
            return p;
        }

        Node find(int id) {
            for (Node c = head; c != null; c = c.next)
                if (c.data.id == id) return c;
            return null;
        }

        boolean remove(int id) {
            Node c = head, prev = null;
            while (c != null) {
                if (c.data.id == id) {
                    if (prev == null) head = c.next; else prev.next = c.next;
                    if (c == tail) tail = prev;
                    size--;
                    return true;
                }
                prev = c; c = c.next;
            }
            return false;
        }

        void display() {
            if (head == null) { System.out.println("No records."); return; }
            System.out.println("ID | Name | Age | Gender | Disease | Phone | Doctor");
            for (Node c = head; c != null; c = c.next) System.out.println(c.data);
        }
    }

    static Scanner sc = new Scanner(System.in);
    static PatientList patients = new PatientList();
    static PatientList queue = new PatientList();

    static int readInt(String msg) {
        while (true) {
            try {
                System.out.print(msg);
                return Integer.parseInt(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    static String readText(String msg) {
        System.out.print(msg);
        return sc.nextLine().trim();
    }

    static Patient readPatient(int id) {
        String name = readText("Name: ");
        int age = readInt("Age: ");
        String gender = readText("Gender: ");
        String disease = readText("Disease: ");
        String phone = readText("Phone number: ");
        String doctor = readText("Doctor name: ");
        return new Patient(id, name, age, gender, disease, phone, doctor);
    }

    public static void main(String[] args) {
        int choice;
        do {
            System.out.println("\n--- Hospital Patient Management System ---");
            System.out.println("1. Add patient");
            System.out.println("2. Display all patients");
            System.out.println("3. Search patient");
            System.out.println("4. Update patient");
            System.out.println("5. Delete patient");
            System.out.println("6. Add patient to waiting queue");
            System.out.println("7. Call next patient from queue");
            System.out.println("8. Show waiting queue");
            System.out.println("0. Exit");
            choice = readInt("Enter choice: ");

            switch (choice) {
                case 1: {
                    int id = readInt("Patient ID: ");
                    if (patients.find(id) != null) { System.out.println("ID already exists."); break; }
                    patients.addLast(readPatient(id));
                    System.out.println("Patient added.");
                    break;
                }
                case 2: patients.display(); break;
                case 3: {
                    Node n = patients.find(readInt("Patient ID: "));
                    System.out.println(n == null ? "Patient not found." : n.data.toString());
                    break;
                }
                case 4: {
                    Node n = patients.find(readInt("Patient ID: "));
                    if (n == null) System.out.println("Patient not found.");
                    else { n.data = readPatient(n.data.id); System.out.println("Patient updated."); }
                    break;
                }
                case 5: {
                    int id = readInt("Patient ID: ");
                    if (patients.remove(id)) { queue.remove(id); System.out.println("Record deleted."); }
                    else System.out.println("Patient not found.");
                    break;
                }
                case 6: {
                    int id = readInt("Patient ID: ");
                    Node n = patients.find(id);
                    if (n == null) System.out.println("Patient not found.");
                    else if (queue.find(id) != null) System.out.println("Already in the queue.");
                    else { queue.addLast(n.data); System.out.println("Added to the waiting queue."); }
                    break;
                }
                case 7: {
                    Patient p = queue.removeFirst();
                    System.out.println(p == null ? "Queue is empty." : "Now calling: " + p.name + " (Dr. " + p.doctor + ")");
                    break;
                }
                case 8: queue.display(); break;
                case 0: System.out.println("Goodbye."); break;
                default: System.out.println("Invalid choice.");
            }
        } while (choice != 0);
    }
}
