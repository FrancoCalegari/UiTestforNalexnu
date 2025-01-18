import tkinter as tk
from tkinter import messagebox, filedialog, Menu
import json
import shutil
import os

class InventoryApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Inventory CRUD App")
        
        self.load_data()
        self.create_widgets()
        self.update_listbox()

    def load_data(self):
        self.filepath = filedialog.askopenfilename(filetypes=[("JSON files", "*.json")])
        if not self.filepath:
            messagebox.showerror("Error", "No file selected")
            self.root.destroy()
        with open(self.filepath, 'r', encoding='utf-8') as file:
            self.data = json.load(file)
        self.image_folder = './objets/'
        if not os.path.exists(self.image_folder):
            os.makedirs(self.image_folder)

    def save_data(self):
        with open(self.filepath, 'w', encoding='utf-8') as file:
            json.dump(self.data, file, indent=4)

    def create_widgets(self):
        # Create Menu
        self.menu = Menu(self.root)
        self.root.config(menu=self.menu)

        self.file_menu = Menu(self.menu, tearoff=0)
        self.menu.add_cascade(label="File", menu=self.file_menu)
        self.file_menu.add_command(label="Add Item", command=self.add_item)
        self.file_menu.add_command(label="Update Item", command=self.update_item)
        self.file_menu.add_command(label="Delete Item", command=self.delete_item)

        # Create Listbox
        self.listbox = tk.Listbox(self.root)
        self.listbox.pack(fill=tk.BOTH, expand=True)
        self.listbox.bind('<<ListboxSelect>>', self.on_select)

        # Create Form
        self.form_frame = tk.Frame(self.root)
        self.form_frame.pack(side=tk.BOTTOM, fill=tk.X)

        self.quantity_label = tk.Label(self.form_frame, text="Quantity:")
        self.quantity_label.pack(side=tk.LEFT)

        self.quantity_entry = tk.Entry(self.form_frame)
        self.quantity_entry.pack(side=tk.LEFT)

        self.name_label = tk.Label(self.form_frame, text="Name:")
        self.name_label.pack(side=tk.LEFT)

        self.name_entry = tk.Entry(self.form_frame)
        self.name_entry.pack(side=tk.LEFT)

        self.price_label = tk.Label(self.form_frame, text="Price:")
        self.price_label.pack(side=tk.LEFT)

        self.price_entry = tk.Entry(self.form_frame)
        self.price_entry.pack(side=tk.LEFT)

        self.image_button = tk.Button(self.form_frame, text="Change Image", command=self.change_image)
        self.image_button.pack(side=tk.LEFT)

        self.image_path = tk.StringVar()
        self.image_label = tk.Label(self.form_frame, textvariable=self.image_path)
        self.image_label.pack(side=tk.LEFT)

    def update_listbox(self):
        self.listbox.delete(0, tk.END)
        for item in self.data['items']:
            self.listbox.insert(tk.END, f"{item['name']} (Qty: {item['quantity']}, Price: {item['price']} 🪙)")
    
    def on_select(self, event):
        selected_index = self.listbox.curselection()
        if selected_index:
            item = self.data['items'][selected_index[0]]
            self.quantity_entry.delete(0, tk.END)
            self.quantity_entry.insert(0, item['quantity'])
            self.name_entry.delete(0, tk.END)
            self.name_entry.insert(0, item['name'])
            self.price_entry.delete(0, tk.END)
            self.price_entry.insert(0, item['price'])
            self.image_path.set(item['image'])
    
    def add_item(self):
        name = self.name_entry.get()
        quantity = int(self.quantity_entry.get())
        price = int(self.price_entry.get())
        image = self.image_path.get()
        
        new_item = {
            "id": self.get_next_id(),
            "quantity": quantity,
            "image": image,
            "name": name,
            "price": price
        }
        
        self.data['items'].append(new_item)
        self.update_listbox()
        self.save_data()
    
    def update_item(self):
        selected_index = self.listbox.curselection()
        if selected_index:
            item = self.data['items'][selected_index[0]]
            item['quantity'] = int(self.quantity_entry.get())
            item['name'] = self.name_entry.get()
            item['price'] = int(self.price_entry.get())
            item['image'] = self.image_path.get()
            self.update_listbox()
            self.save_data()
    
    def delete_item(self):
        selected_index = self.listbox.curselection()
        if selected_index:
            del self.data['items'][selected_index[0]]
            self.update_listbox()
            self.save_data()
    
    def change_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png *.jpg *.jpeg *.webp")])
        if file_path:
            filename = os.path.basename(file_path)
            dest_path = os.path.join(self.image_folder, filename)
            if file_path != dest_path:
                shutil.copy(file_path, dest_path)
            relative_path = os.path.join('./objets', filename).replace("\\", "/")
            self.image_path.set(relative_path)
            selected_index = self.listbox.curselection()
            if selected_index:
                self.data['items'][selected_index[0]]['image'] = relative_path
                self.save_data()

    def get_next_id(self):
        if self.data['items']:
            return max(item['id'] for item in self.data['items']) + 1
        else:
            return 1

if __name__ == "__main__":
    root = tk.Tk()
    app = InventoryApp(root)
    root.mainloop()
