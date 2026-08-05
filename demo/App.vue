<template>
  <div class="demo-container">
    <mu-appbar title="Muse UI Vue3 Demo">
      <template v-slot:left>
        <mu-button icon @click="drawerOpen = !drawerOpen">
          <mu-icon value="menu" />
        </mu-button>
      </template>
      <template v-slot:right>
        <mu-button icon>
          <mu-icon value="more_vert" />
        </mu-button>
      </template>
    </mu-appbar>

    <mu-drawer v-model:open="drawerOpen" :docked="false">
      <mu-list @itemClick="drawerOpen = false">
        <mu-sub-header>Navigation</mu-sub-header>
        <mu-list-item button title="Home" value="home" />
        <mu-list-item button title="Components" value="components" />
      </mu-list>
    </mu-drawer>

    <div class="demo-content">
      <!-- 1. Alert -->
      <section class="demo-section">
        <h3 class="demo-title">Alert</h3>
        <mu-alert>Default alert</mu-alert>
        <mu-alert color="success">Success alert — everything is OK</mu-alert>
        <mu-alert color="info">Info alert — some information</mu-alert>
        <mu-alert color="warning">Warning alert — be careful</mu-alert>
        <mu-alert color="error" delete @delete="handleDelete">Error alert with delete</mu-alert>
      </section>

      <!-- 2. AppBar -->
      <section class="demo-section">
        <h3 class="demo-title">AppBar</h3>
        <mu-paper :z-depth="1">
          <mu-appbar title="AppBar Title">
            <template v-slot:left>
              <mu-button icon>
                <mu-icon value="menu" />
              </mu-button>
            </template>
            <template v-slot:right>
              <mu-button icon>
                <mu-icon value="more_vert" />
              </mu-button>
            </template>
          </mu-appbar>
        </mu-paper>
      </section>

      <!-- 3. AutoComplete -->
      <section class="demo-section">
        <h3 class="demo-title">AutoComplete</h3>
        <mu-auto-complete
          v-model="autoCompleteVal"
          label="Fruit"
          helper-text="Type a fruit name"
          :data="['Apple', 'Banana', 'Cherry', 'Orange', 'Grape', 'Watermelon']"
        />
      </section>

      <!-- 4. Avatar -->
      <section class="demo-section">
        <h3 class="demo-title">Avatar</h3>
        <mu-avatar>A</mu-avatar>
        <mu-avatar color="teal">T</mu-avatar>
        <mu-avatar color="red">
          <mu-icon value="face" />
        </mu-avatar>
        <mu-avatar color="amber" text-color="black">J</mu-avatar>
      </section>

      <!-- 5. Badge -->
      <section class="demo-section">
        <h3 class="demo-title">Badge</h3>
        <mu-badge content="12">
          <mu-icon value="mail" :size="36" />
        </mu-badge>
        <mu-badge content="99+" color="secondary">
          <mu-icon value="notifications" :size="36" />
        </mu-badge>
      </section>

      <!-- 6. BottomNav -->
      <section class="demo-section">
        <h3 class="demo-title">BottomNav</h3>
        <mu-paper :z-depth="1">
          <mu-bottom-nav v-model="bottomNavValue">
            <mu-bottom-nav-item title="Recents" icon="restore" />
            <mu-bottom-nav-item title="Favorites" icon="favorite" />
            <mu-bottom-nav-item title="Nearby" icon="location_on" />
          </mu-bottom-nav>
        </mu-paper>
        <p>Selected: {{ bottomNavValue }}</p>
      </section>

      <!-- 7. BottomSheet -->
      <section class="demo-section">
        <h3 class="demo-title">BottomSheet</h3>
        <mu-button @click="bottomSheetOpen = true">Open BottomSheet</mu-button>
        <mu-bottom-sheet :open="bottomSheetOpen" @update:open="bottomSheetOpen = $event">
          <mu-list @itemClick="bottomSheetOpen = false">
            <mu-sub-header>Choose an action</mu-sub-header>
            <mu-list-item button title="Share" value="share" />
            <mu-list-item button title="Upload" value="upload" />
            <mu-list-item button title="Copy Link" value="copy" />
          </mu-list>
        </mu-bottom-sheet>
      </section>

      <!-- 8. Breadcrumbs -->
      <section class="demo-section">
        <h3 class="demo-title">Breadcrumbs</h3>
        <mu-breadcrumbs divider="-">
          <mu-breadcrumbs-item>Home</mu-breadcrumbs-item>
          <mu-breadcrumbs-item>Components</mu-breadcrumbs-item>
          <mu-breadcrumbs-item>Breadcrumbs</mu-breadcrumbs-item>
        </mu-breadcrumbs>
      </section>

      <!-- 9. Button -->
      <section class="demo-section">
        <h3 class="demo-title">Button</h3>
        <mu-button color="primary" @click="handleClick">Primary</mu-button>
        <mu-button color="secondary">Secondary</mu-button>
        <mu-button flat>Flat</mu-button>
        <mu-button icon color="accent">
          <mu-icon value="favorite" />
        </mu-button>
        <mu-button fab color="red" @click="handleClick">
          <mu-icon value="add" />
        </mu-button>
        <mu-button round>Round</mu-button>
      </section>

      <!-- 10. Card -->
      <section class="demo-section">
        <h3 class="demo-title">Card</h3>
        <mu-card raised>
          <mu-card-header title="Title" sub-title="Subtitle">
            <template v-slot:avatar>
              <mu-avatar color="primary">M</mu-avatar>
            </template>
          </mu-card-header>
          <mu-card-media title="Image Title">
            <img src="https://via.placeholder.com/600x300/3f51b5/fff?text=Card+Image" alt="placeholder" />
          </mu-card-media>
          <mu-card-title title="Card Title" sub-title="Card Subtitle" />
          <mu-card-text>This is the card body text. Lorem ipsum dolor sit amet.</mu-card-text>
          <mu-card-actions>
            <mu-button flat color="primary">Action 1</mu-button>
            <mu-button flat color="primary">Action 2</mu-button>
          </mu-card-actions>
        </mu-card>
      </section>

      <!-- 11. Carousel -->
      <section class="demo-section">
        <h3 class="demo-title">Carousel</h3>
        <mu-carousel style="height: 200px">
          <mu-carousel-item>
            <div class="carousel-slide" style="background: #3f51b5">Slide 1</div>
          </mu-carousel-item>
          <mu-carousel-item>
            <div class="carousel-slide" style="background: #f44336">Slide 2</div>
          </mu-carousel-item>
          <mu-carousel-item>
            <div class="carousel-slide" style="background: #4caf50">Slide 3</div>
          </mu-carousel-item>
        </mu-carousel>
      </section>

      <!-- 12. Checkbox -->
      <section class="demo-section">
        <h3 class="demo-title">Checkbox</h3>
        <mu-checkbox v-model="checkbox1" label="Default" />
        <mu-checkbox v-model="checkbox2" label="Checked" color="primary" />
        <mu-checkbox disabled label="Disabled" />
      </section>

      <!-- 13. Chip -->
      <section class="demo-section">
        <h3 class="demo-title">Chip</h3>
        <mu-chip>Simple Chip</mu-chip>
        <mu-chip color="primary">Primary Chip</mu-chip>
        <mu-chip color="secondary" delete @delete="handleDelete">Deletable</mu-chip>
        <mu-chip selected color="teal">Selected</mu-chip>
      </section>

      <!-- 14. DateInput / DatePicker / TimePicker / DateTimePicker -->
      <section class="demo-section">
        <h3 class="demo-title">Date / Time Picker</h3>
        <mu-date-input type="date" v-model="dateVal" label="Date" />
        <mu-date-input type="time" v-model="timeVal" label="Time" />
        <mu-date-input type="dateTime" v-model="dateTimeVal" label="DateTime" />
        <mu-paper :z-depth="1">
          <mu-date-picker v-model="dateVal" />
        </mu-paper>
        <mu-paper :z-depth="1">
          <mu-time-picker v-model="timeVal" />
        </mu-paper>
      </section>

      <!-- 15. DataTable -->
      <section class="demo-section">
        <h3 class="demo-title">DataTable</h3>
        <mu-data-table :columns="tableColumns" :data="tableData" stripe>
          <template v-slot:expand="{ row }">
            <div style="padding: 16px">Details for {{ row.name }}</div>
          </template>
        </mu-data-table>
      </section>

      <!-- 16. Dialog -->
      <section class="demo-section">
        <h3 class="demo-title">Dialog</h3>
        <mu-button @click="dialogOpen = true">Open Dialog</mu-button>
        <mu-dialog
          title="Dialog Title"
          :open="dialogOpen"
          @update:open="dialogOpen = $event"
        >
          This is a dialog with some content.
          <template v-slot:actions>
            <mu-button flat color="primary" @click="dialogOpen = false">Close</mu-button>
          </template>
        </mu-dialog>
      </section>

      <!-- 17. Divider -->
      <section class="demo-section">
        <h3 class="demo-title">Divider</h3>
        <p>Above the divider</p>
        <mu-divider />
        <p>Below the divider</p>
        <mu-divider inset />
      </section>

      <!-- 18. Drawer -->
      <section class="demo-section">
        <h3 class="demo-title">Drawer</h3>
        <mu-button @click="drawerOpen2 = !drawerOpen2">Toggle Drawer</mu-button>
        <mu-drawer v-model:open="drawerOpen2" :docked="false">
          <mu-list>
            <mu-sub-header>Menu</mu-sub-header>
            <mu-list-item title="Item 1" value="1" />
            <mu-list-item title="Item 2" value="2" />
            <mu-list-item title="Item 3" value="3" />
          </mu-list>
        </mu-drawer>
      </section>

      <!-- 19. ExpansionPanel -->
      <section class="demo-section">
        <h3 class="demo-title">ExpansionPanel</h3>
        <mu-expansion-panel v-model="panelExpand" :zDepth="2">
          <template v-slot:header>
            <div>Panel Header</div>
          </template>
          Panel content goes here. Click the header to expand/collapse.
        </mu-expansion-panel>
      </section>

      <!-- 20. Form -->
      <section class="demo-section">
        <h3 class="demo-title">Form</h3>
        <mu-form :model="formModel">
          <mu-form-item label="Username" prop="username" :rules="usernameRules">
            <mu-text-field v-model="formModel.username" />
          </mu-form-item>
          <mu-form-item label="Password" prop="password" :rules="passwordRules">
            <mu-text-field v-model="formModel.password" type="password" autocomplete="current-password" />
          </mu-form-item>
          <mu-button type="submit" color="primary">Submit</mu-button>
        </mu-form>
      </section>

      <!-- 21. Grid (Container, Row, Col) -->
      <section class="demo-section">
        <h3 class="demo-title">Grid</h3>
        <mu-container>
          <mu-row>
            <mu-col span="4"><div class="grid-demo">col-4</div></mu-col>
            <mu-col span="4"><div class="grid-demo">col-4</div></mu-col>
            <mu-col span="4"><div class="grid-demo">col-4</div></mu-col>
          </mu-row>
          <mu-row>
            <mu-col span="6"><div class="grid-demo">col-6</div></mu-col>
            <mu-col span="6"><div class="grid-demo">col-6</div></mu-col>
          </mu-row>
        </mu-container>
      </section>

      <!-- 22. GridList -->
      <section class="demo-section">
        <h3 class="demo-title">GridList</h3>
        <mu-grid-list :cell-height="120" :cols="3">
          <mu-grid-tile v-for="tile in gridTiles" :key="tile.title">
            <img :src="tile.img" :alt="tile.title" style="width:100%;height:100%;object-fit:cover" />
            <template v-slot:title>
              <span>{{ tile.title }}</span>
            </template>
          </mu-grid-tile>
        </mu-grid-list>
      </section>

      <!-- 23. Icon -->
      <section class="demo-section">
        <h3 class="demo-title">Icon</h3>
        <mu-icon value="home" :size="32" />
        <mu-icon value="favorite" :size="32" color="red" />
        <mu-icon value="face" :size="32" color="blue" />
        <mu-icon value="star" :size="32" color="amber" />
      </section>

      <!-- 24. List -->
      <section class="demo-section">
        <h3 class="demo-title">List</h3>
        <mu-list>
          <mu-sub-header>Inbox</mu-sub-header>
          <mu-list-item button title="Inbox" value="inbox">
            <mu-icon value="inbox" />
          </mu-list-item>
          <mu-list-item button title="Starred" value="starred">
            <mu-icon value="star" />
          </mu-list-item>
          <mu-list-item button title="Send Email" value="send">
            <mu-icon value="send" />
          </mu-list-item>
          <mu-divider />
          <mu-sub-header>Labels</mu-sub-header>
          <mu-list-item button title="Work" value="work">
            <mu-icon value="work" />
          </mu-list-item>
        </mu-list>
      </section>

      <!-- 25. LoadMore -->
      <section class="demo-section">
        <h3 class="demo-title">LoadMore</h3>
        <mu-load-more :loading="loading" @load="handleLoad">
          <mu-list>
            <mu-list-item v-for="n in 5" :key="n" :title="`Item ${n}`" button/>
          </mu-list>
        </mu-load-more>
      </section>

      <!-- 26. Menu -->
      <section class="demo-section">
        <h3 class="demo-title">Menu</h3>
        <mu-menu v-model:open="menuOpen">
          <mu-button @click="menuOpen = !menuOpen">Open Menu</mu-button>
          <template v-slot:content>
            <mu-list @itemClick="menuOpen = false">
              <mu-list-item button title="Option 1" value="1" />
              <mu-list-item button title="Option 2" value="2" />
              <mu-list-item button title="Option 3" value="3" />
            </mu-list>
          </template>
        </mu-menu>
      </section>

      <!-- 27. Pagination -->
      <section class="demo-section">
        <h3 class="demo-title">Pagination</h3>
        <mu-pagination :total="100" v-model="pageCurrent" />
        <p>Current page: {{ pageCurrent }}</p>
      </section>

      <!-- 28. Paper -->
      <section class="demo-section">
        <h3 class="demo-title">Paper</h3>
        <mu-paper :z-depth="1" class="paper-demo">z-depth=1</mu-paper>
        <mu-paper :z-depth="2" class="paper-demo">z-depth=2</mu-paper>
        <mu-paper :z-depth="4" class="paper-demo">z-depth=4</mu-paper>
        <mu-paper circle class="paper-demo">Circle</mu-paper>
      </section>

      <!-- 29. Popover -->
      <section class="demo-section">
        <h3 class="demo-title">Popover</h3>
        <mu-button ref="popoverAnchor" @click="togglePopover">Toggle Popover</mu-button>
        <mu-popover
          v-model:open="popoverOpen"
          :trigger="popoverTrigger"
        >
          <mu-list @itemClick="popoverOpen = false">
            <mu-list-item button title="Action 1" value="1" />
            <mu-list-item button title="Action 2" value="2" />
          </mu-list>
        </mu-popover>
      </section>

      <!-- 30. Progress -->
      <section class="demo-section">
        <h3 class="demo-title">Progress</h3>
        <h4>Linear</h4>
        <mu-linear-progress mode="indeterminate" />
        <mu-linear-progress :value="50" mode="determinate" />
        <h4>Circular</h4>
        <mu-circular-progress :size="40" />
        <mu-circular-progress :size="40" color="red" />
      </section>

      <!-- 31. Radio -->
      <section class="demo-section">
        <h3 class="demo-title">Radio</h3>
        <mu-radio v-model="radioVal" value="option1" label="Option 1" />
        <mu-radio v-model="radioVal" value="option2" label="Option 2" />
        <mu-radio v-model="radioVal" value="option3" label="Option 3" />
        <p>Selected: {{ radioVal }}</p>
      </section>

      <!-- 32. Select -->
      <section class="demo-section">
        <h3 class="demo-title">Select</h3>
        <mu-select label="Country" v-model="selectVal">
          <mu-option v-for="c in countries" :key="c" :label="c" :value="c" />
        </mu-select>
        <p>Selected: {{ selectVal }}</p>
        <mu-select label="Multiple" multiple v-model="multiSelectVal">
          <mu-option v-for="c in countries" :key="c" :label="c" :value="c" />
        </mu-select>
        <p>Selected: {{ multiSelectVal }}</p>
      </section>

      <!-- 33. SlidePicker -->
      <section class="demo-section">
        <h3 class="demo-title">SlidePicker</h3>
        <mu-slide-picker :slots="slidePickerSlots" />
      </section>

      <!-- 34. Slider -->
      <section class="demo-section">
        <h3 class="demo-title">Slider</h3>
        <mu-slider v-model="sliderVal" :max="100" />
        <p>Value: {{ sliderVal }}</p>
      </section>

      <!-- 35. Snackbar -->
      <section class="demo-section">
        <h3 class="demo-title">Snackbar</h3>
        <mu-button @click="snackbarOpen = true">Show Snackbar</mu-button>
        <mu-snackbar
          :open="snackbarOpen"
          message="This is a snackbar message"
          @update:open="snackbarOpen = $event"
        />
      </section>

      <!-- 36. Stepper -->
      <section class="demo-section">
        <h3 class="demo-title">Stepper</h3>
        <mu-stepper v-model="stepperStep">
          <mu-step :active="stepperStep === 0" :completed="stepperStep > 0">
            <mu-step-label>Step 1</mu-step-label>
            <mu-step-content>Content for step 1</mu-step-content>
          </mu-step>
          <mu-step :active="stepperStep === 1" :completed="stepperStep > 1">
            <mu-step-label>Step 2</mu-step-label>
            <mu-step-content>Content for step 2</mu-step-content>
          </mu-step>
          <mu-step :active="stepperStep === 2">
            <mu-step-label>Step 3</mu-step-label>
            <mu-step-content>Content for step 3</mu-step-content>
          </mu-step>
        </mu-stepper>
        <mu-button flat @click="stepperStep--" :disabled="stepperStep === 0">Previous</mu-button>
        <mu-button flat @click="stepperStep++" :disabled="stepperStep === 2">Next</mu-button>
      </section>

      <!-- 37. SubHeader -->
      <section class="demo-section">
        <h3 class="demo-title">SubHeader</h3>
        <mu-sub-header>Default SubHeader</mu-sub-header>
        <mu-sub-header inset>Inset SubHeader</mu-sub-header>
      </section>

      <!-- 38. Switch -->
      <section class="demo-section">
        <h3 class="demo-title">Switch</h3>
        <mu-switch v-model="switchVal" label="Toggle me" />
        <mu-switch v-model="switchVal2" label="On by default" color="primary" />
      </section>

      <!-- 39. Tabs -->
      <section class="demo-section">
        <h3 class="demo-title">Tabs</h3>
        <mu-tabs v-model="tabVal" color="primary" text-color="white">
          <mu-tab title="Tab 1" value="tab1" />
          <mu-tab title="Tab 2" value="tab2" />
          <mu-tab title="Tab 3" value="tab3" />
        </mu-tabs>
        <div class="tab-content" v-if="tabVal === 'tab1'">Tab 1 content</div>
        <div class="tab-content" v-else-if="tabVal === 'tab2'">Tab 2 content</div>
        <div class="tab-content" v-else>Tab 3 content</div>
      </section>

      <!-- 40. TextField -->
      <section class="demo-section">
        <h3 class="demo-title">TextField</h3>
        <mu-text-field v-model="textFieldVal" label="Default" />
        <mu-text-field label="With icon" icon="search" />
        <mu-text-field label="Multiline" multi-line :rows="3" />
        <form><mu-text-field label="New Password" type="password" autocomplete="new-password" /></form>
      </section>

      <!-- 41. Tooltip -->
      <section class="demo-section">
        <h3 class="demo-title">Tooltip</h3>
        <mu-tooltip content="Tooltip text">
          <mu-button>Hover me</mu-button>
        </mu-tooltip>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      autoCompleteVal: '',
      drawerOpen: false,
      bottomNavValue: 0,
      bottomSheetOpen: false,
      checkbox1: false,
      checkbox2: true,
      dateVal: new Date(),
      timeVal: new Date(),
      dateTimeVal: new Date(),
      dialogOpen: false,
      drawerOpen2: false,
      panelExpand: false,
      formModel: { username: '', password: '' },
      usernameRules: [
        { validate: (val) => !!val, message: 'Username is required' },
        { validate: (val) => val.length >= 3, message: 'Min 3 characters' }
      ],
      passwordRules: [
        { validate: (val) => !!val, message: 'Password is required' },
        { validate: (val) => val.length >= 6, message: 'Min 6 characters' }
      ],
      gridTiles: [
        { title: 'Image 1', img: 'https://via.placeholder.com/200x120/3f51b5/fff?text=1' },
        { title: 'Image 2', img: 'https://via.placeholder.com/200x120/f44336/fff?text=2' },
        { title: 'Image 3', img: 'https://via.placeholder.com/200x120/4caf50/fff?text=3' },
        { title: 'Image 4', img: 'https://via.placeholder.com/200x120/ff9800/fff?text=4' },
        { title: 'Image 5', img: 'https://via.placeholder.com/200x120/9c27b0/fff?text=5' },
        { title: 'Image 6', img: 'https://via.placeholder.com/200x120/00bcd4/fff?text=6' }
      ],
      loading: false,
      menuOpen: false,
      pageCurrent: 1,
      popoverOpen: false,
      popoverTrigger: null,
      radioVal: 'option1',
      selectVal: '',
      multiSelectVal: [],
      countries: ['China', 'USA', 'Japan', 'Germany', 'France'],
      slidePickerSlots: [
        { values: ['Red', 'Blue', 'Green'], defaultIndex: 0 }
      ],
      sliderVal: 30,
      snackbarOpen: false,
      stepperStep: 0,
      switchVal: false,
      switchVal2: true,
      tabVal: 'tab1',
      textFieldVal: '',
      tableColumns: [
        { title: 'Name', name: 'name' },
        { title: 'Email', name: 'email' },
        { title: 'Age', name: 'age' }
      ],
      tableData: [
        { name: 'John', email: 'john@example.com', age: 28 },
        { name: 'Jane', email: 'jane@example.com', age: 32 },
        { name: 'Bob', email: 'bob@example.com', age: 25 }
      ]
    };
  },
  methods: {
    togglePopover() {
      this.popoverOpen = !this.popoverOpen;
      console.log('tp:', this.popoverOpen);
      this.popoverTrigger = this.$refs.popoverAnchor.$el;
    },
    handleClick() {
      console.log('Button clicked');
    },
    handleDelete() {
      console.log('Delete action');
    },
    handleLoad() {
      this.loading = true;
      setTimeout(() => { this.loading = false; }, 2000);
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background: #f5f5f5;
  color: #333;
}
.demo-container {
  min-height: 100vh;
}
.demo-content {
  padding: 24px;
  max-width: 960px;
  margin: 0 auto;
}
.demo-section {
  margin-bottom: 36px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}
.demo-title {
  margin: 0 0 16px;
  color: #3f51b5;
  font-size: 18px;
  border-bottom: 2px solid #3f51b5;
  padding-bottom: 8px;
}
.carousel-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #fff;
  font-size: 24px;
}
.grid-demo {
  background: #3f51b5;
  color: #fff;
  padding: 12px;
  text-align: center;
  border-radius: 2px;
}
.paper-demo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  margin: 8px;
}
.tab-content {
  padding: 16px;
  background: #fafafa;
}
</style>
