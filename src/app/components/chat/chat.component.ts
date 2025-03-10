import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})

export class ChatComponent {
  
  isChatOpen: boolean = false;
  chatMessages: { text: string, sender: string }[] = [];
  isLoading1: boolean = false;

  productsI = ["קמח", "סוכר", "שמן", "אבקת אפייה", "חלב", "מלח"];
  units = ["כף", "כוס", "כפית", "ליטר", "מ\"ל", "גרם"];
  selectedAmount: number = 1;
  selectedProductI: string = "";
  selectedUnit: string = "";

  conversionData: Record<string, Record<string, number>> = {
    "קמח": { "כוס": 120, "כף": 10, "כפית": 3, "גרם": 1 },
    "סוכר": { "כוס": 200, "כף": 15, "כפית": 5, "גרם": 1 },
    "שמן": { "כוס": 240, "כף": 15, "כפית": 5, "מ\"ל": 1 },
    "חלב": { "כוס": 250, "כף": 15, "כפית": 5, "מ\"ל": 1, "ליטר": 1000 },
    "מלח": { "כוס": 230, "כף": 18, "כפית": 6, "גרם": 1 }
  };

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.chatMessages.length === 0) {
      this.chatMessages.push({ text: "שלום! בחר כמות, מוצר ויחידה להמרה.", sender: 'bot' });
    }
  }

  convertMeasurement(): string {
    if (!this.selectedProductI || !this.selectedUnit) {
      return "⚠ יש לבחור מוצר ויחידה לפני החישוב.";
    }

    const conversion = this.conversionData[this.selectedProductI];
    if (!conversion) return "🤷‍♂️ לא מצאתי את ההמרה.";

    let response = `${this.selectedAmount} ${this.selectedUnit} של ${this.selectedProductI} שווה ל:\n`;

    const baseValue = this.selectedAmount * (conversion[this.selectedUnit] || 1);
    for (let unit in conversion) {
      if (unit !== this.selectedUnit) {
        const convertedValue = baseValue / conversion[unit];
        response += `▪️${convertedValue.toFixed(2)} ${unit}\n`;
      }
    }

    return response.trim();
  }

  sendMessage() {
    if (!this.selectedProductI || !this.selectedUnit || !this.selectedAmount) {
      return;
    }

    this.chatMessages.push({
      text: `${this.selectedAmount} ${this.selectedUnit} של ${this.selectedProductI}`,
      sender: 'user'
    });

    this.isLoading1 = true;

    setTimeout(() => {
      const botResponse = this.convertMeasurement();
      this.chatMessages.push({ text: botResponse, sender: 'bot' });
      this.isLoading1 = false;
    }, 1000);
  }
}
